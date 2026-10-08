import consultModel from "../models/consultationModel.js";
import orderAModel from "../models/orderAModel.js";
import orderModel from "../models/orderModel.js";
import siteSettingsModel from "../models/siteSettingsModel.js";
import { defaultSiteContent } from "../../client/src/data/siteDefaults.js";

async function getConfiguredService(serviceSlug) {
  const settings = await siteSettingsModel.findOne({ key: 'main' }).lean();
  const savedContent = settings?.content || {};
  const savedServices = Array.isArray(savedContent.services) ? savedContent.services : [];

  const findService = (catalog) => {
    for (const service of catalog) {
      if (service.slug === serviceSlug) return service;
      const sector = service.sectors?.find(item => item.slug === serviceSlug);
      if (sector) return sector;
    }
    return null;
  };

  if (serviceSlug === 'book-consultation') {
    return savedContent.booking?.consultation || defaultSiteContent.booking.consultation;
  }

  return findService(savedServices) || findService(defaultSiteContent.services);
}

async function requestPaystack(path, options = {}) {
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json();

  if (!response.ok || !payload.status) {
    const error = new Error(payload.message || 'Paystack request failed');
    error.paystackResponse = payload;
    throw error;
  }

  return payload.data;
}

export const createOrderA = async (req, res) => {
  try {
    const { name, email, phone, date, time, notes, serviceName, servicePrice } = req.body.formData;
    const clientName = name;
    // Validate required fields
    if (!clientName || !email || !phone || !date || !time || !serviceName || servicePrice === undefined || servicePrice === null || servicePrice === '') {
      return res.status(400).json({ success: false, message: 'Missing Required Details' });
    }
    const order = new orderModel({ clientName, email, phone, date, time, notes, serviceName, servicePrice });
    await order.save();

    return res.json({ success: true, message: "Order successfully created", data: order._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const createConsult = async (req, res) => {
  try {
    const { name, email, phone, message, orderNumber, subject } = req.body.formData;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Missing Required Details' });
    }

    if (!orderNumber) {
      const consult = new consultModel({name, email, phone, message, subject});
      await consult.save();
      return res.json({ success: true, message: "Inquirery Sent", data: consult._id });
    }else{
      const consult = new consultModel({name, email, phone, message, orderNumber, subject});
      await consult.save();
      return res.json({ success: true, message: "Inquirery Sent", data: consult._id });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const createOrder = async (req, res) => {

  try {
    const { customer, items, total, paymentRef, status } = req.body.orderData;
    const { name, email, phone, address } = customer;
    const { price, quantity, color, size, image } = items[0];
    const customerName = name;
    const itemName = items[0].name
    
    // Validate required fields
    if (!customerName || !email || !phone || !address || !itemName || !price || !quantity || !total || !paymentRef || !status || !image) {
      return res.status(400).json({ success: false, message: 'Missing Required Details' });
    }
    
    const order = new orderAModel({ customerName, email, phone, address, itemName, price, quantity, total, paymentRef, status, color, size, image });
    await order.save();

    return res.json({ success: true, message: "Order successfully created", data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const updateOrder = async (req, res) => {
  let updatedOrder;
  
try {
  const { orderId,status } = req.body;

  updatedOrder = await orderAModel.findByIdAndUpdate(orderId,
      { status },
      { new: true });
  

  if (!updatedOrder) {
    return res.json({ success: false, message: 'Order not found' });
  }

  return res.json({ success: true, product: updatedOrder });
} catch (error) {
  console.error(error);
  return res.json({ success: false, message: 'Failed to update order' });
}
}

export const deleteOrder = async (req, res) => {

    const { orderId } = req.body

  try {
    await orderAModel.deleteOne({ _id: orderId });
    return res.json({ success: true, message: "Order Deleted!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to delete order' });
  }
}

export const getOrderData = async (req, res) => {
  try {
    const orders = await orderAModel.find();

    if (!orders.length) {
      return res.json({ success: false, message: "No orders found!" });
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to get orders' });
  }
}

export const getOrderDataIndividual = async (req, res) => {
  try {

    const orderId = req.query.orderId

    const order = await orderAModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "No orders found!" });
    }

    return res.json({ success: true, data:order });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to get orders' });
  }
}

export const updateConsult = async (req, res) => {
  let updatedConsult;
  
  try {
    const { consultId,status } = req.body;

    updatedConsult = await consultModel.findByIdAndUpdate(consultId,
        { status },
        { new: true });
    

    if (!updatedConsult) {
      return res.json({ success: false, message: 'Consult not found' });
    }

    return res.json({ success: true, consult: updatedConsult });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to update Consult' });
  }
}

export const getConsultData = async (req, res) => {
  try {
    const consults = await consultModel.find();

    if (!consults.length) {
      return res.json({ success: false, message: "No consults found!" });
    }

    return res.json({ success: true, consults });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to get cunsult' });
  }
}

export const deleteConsult = async (req, res) => {

  const { consultId } = req.body

  try {
    await consultModel.deleteOne({ _id: consultId });
    return res.json({ success: true, message: "consult Deleted!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Failed to delete consult' });
  }
}

export const initializePayment = async (req, res) => {
  try {
    const { email, serviceSlug, serviceName, callbackUrl } = req.body?.formData || {};
    const service = await getConfiguredService(serviceSlug);
    const amount = Number(service?.price);

    if (!email || !serviceSlug || !serviceName || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Online payment is not available for this service yet.' });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('Paystack initialization failed: PAYSTACK_SECRET_KEY is not configured');
      return res.status(503).json({ success: false, message: 'Online payment is temporarily unavailable. Please try again later.' });
    }

    const reference = `JINT-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const payment = await requestPaystack('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency: 'GHS',
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL || callbackUrl,
        metadata: { serviceSlug, serviceName },
      }),
    });

    return res.json({ success: true, authorizationUrl: payment.authorization_url, reference: payment.reference, amount });
  } catch (error) {
    console.error('Paystack payment initialization failed:', error);
    return res.status(502).json({ success: false, message: 'We could not start secure payment. Please try again.' });
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { reference, formData } = req.body || {};
    const { name, email, phone, date, time, notes, serviceSlug } = formData || {};
    const service = await getConfiguredService(serviceSlug);
    const amount = Number(service?.price);

    if (!reference || !name || !email || !phone || !date || !time || !serviceSlug || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'We could not verify this booking. Please contact us for help.' });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('Paystack verification failed: PAYSTACK_SECRET_KEY is not configured');
      return res.status(503).json({ success: false, message: 'Payment verification is temporarily unavailable. Please contact us.' });
    }

    const existingBooking = await orderModel.findOne({ paymentReference: reference });
    if (existingBooking) {
      return res.json({ success: true, message: 'Payment verified and booking received.', data: existingBooking._id });
    }

    const payment = await requestPaystack(`/transaction/verify/${encodeURIComponent(reference)}`);
    const expectedAmount = Math.round(amount * 100);

    if (payment.status !== 'success' || Number(payment.amount) !== expectedAmount || payment.currency !== 'GHS') {
      console.error('Paystack payment verification mismatch:', { reference, expectedAmount, payment });
      return res.status(400).json({ success: false, message: 'Payment could not be verified. Please contact us before trying again.' });
    }

    const booking = await orderModel.create({
      clientName: name,
      email,
      phone,
      date,
      time,
      notes,
      serviceName: service.title,
      servicePrice: amount,
      paymentReference: reference,
      paymentStatus: 'paid',
      status: 'paid',
    });

    return res.json({ success: true, message: 'Payment verified and booking received.', data: booking._id });
  } catch (error) {
    console.error('Paystack payment verification failed:', error);
    return res.status(502).json({ success: false, message: 'We could not confirm your payment. Please contact us before trying again.' });
  }
}