import mongoose, { Schema } from 'mongoose';

const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: any, ret: any) => {
    ret.id = ret.id || String(ret._id);
    delete ret.passwordHash;
    delete ret.verifyToken;
    delete ret.resetToken;
    delete ret.resetTokenExpires;
    return ret;
  },
};

const AddressSchema = new Schema(
  {
    fullName: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    verifyToken: String,
    resetToken: String,
    resetTokenExpires: Date,
    address: AddressSchema,
    lastLoginAt: Date,
  },
  { timestamps: true, toJSON }
);

const ProductSchema = new Schema(
  {
    // Public slug-style id used in URLs (/product/:id) and in the cart
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    fabric: { type: String, default: '' },
    description: { type: String, default: '' },
    details: { type: [String], default: [] },
    careInstructions: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [{ name: String, hex: String, _id: false }], default: [] },
    // `isNew` is reserved by Mongoose, so it is stored as isNewArrival and exposed as isNew
    isNewArrival: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      ...toJSON,
      transform: (doc: any, ret: any) => {
        toJSON.transform(doc, ret);
        ret.isNew = !!ret.isNewArrival;
        delete ret.isNewArrival;
        return ret;
      },
    },
  }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    count: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON }
);

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
] as const;

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: {
      fullName: String,
      phoneNumber: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      orderNotes: String,
    },
    items: [
      {
        productId: String,
        name: String,
        image: String,
        size: String,
        color: String,
        price: Number,
        quantity: Number,
        _id: false,
      },
    ],
    subtotal: Number,
    shipping: { type: Number, default: 0 },
    total: Number,
    paymentMethod: { type: String, enum: ['razorpay', 'cod', 'whatsapp'], default: 'cod' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    trackingNumber: String,
    courier: String,
    adminNote: String,
    statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now }, _id: false }],
  },
  { timestamps: true, toJSON }
);

const SettingsSchema = new Schema(
  {
    key: { type: String, default: 'main', unique: true },
    razorpayEnabled: { type: Boolean, default: false },
    razorpayKeyId: { type: String, default: '' },
    razorpayKeySecret: { type: String, default: '' },
    codEnabled: { type: Boolean, default: true },
    whatsappOrderEnabled: { type: Boolean, default: true },
    shippingFee: { type: Number, default: 0 },
    freeShippingAbove: { type: Number, default: 1999 },
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpSecure: { type: Boolean, default: false },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    mailFrom: { type: String, default: '' },
    adminNotifyEmail: { type: String, default: '' },
    requireEmailVerification: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
export const Product = mongoose.model('Product', ProductSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Order = mongoose.model('Order', OrderSchema);
export const Settings = mongoose.model('Settings', SettingsSchema);

export async function getSettings() {
  let s = await Settings.findOne({ key: 'main' });
  if (!s) s = await Settings.create({ key: 'main' });
  return s;
}
