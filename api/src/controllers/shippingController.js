import { asyncHandler } from '../utils/asyncHandler.js';
import { EasyParcelService } from '../services/easyParcelService.js';

export class ShippingController {
  constructor(env) {
    this.ep = new EasyParcelService(env);
  }

  getQuotations = asyncHandler(async (req, res) => {
    const { senderPostcode, senderState, receiverPostcode, receiverState, weight } = req.body;
    if (!senderPostcode || !receiverPostcode) {
      return res.status(400).json({ status: 'error', errorMessage: 'Postcode pengirim dan penerima diperlukan.' });
    }
    const quotes = await this.ep.getQuotations({
      senderPostcode,
      senderState: senderState || 'MY-14',
      receiverPostcode,
      receiverState: receiverState || 'MY-14',
      weight: Number(weight) || 1
    });
    res.json({ status: 'success', data: quotes });
  });

  getTracking = asyncHandler(async (req, res) => {
    const { awb } = req.query;
    if (!awb) return res.status(400).json({ status: 'error', errorMessage: 'AWB diperlukan.' });
    const data = await this.ep.getTracking(awb);
    res.json({ status: 'success', data });
  });
}
