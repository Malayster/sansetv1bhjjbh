import { asyncHandler } from '../utils/asyncHandler.js';

export class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }

    getSettings = asyncHandler(async (req, res, next) => {
        const settings = await this.settingsService.getSettings();
        res.json({ status: 'success', data: settings || {} });
    });

    getPublicSettings = asyncHandler(async (req, res, next) => {
        const settings = await this.settingsService.getSettings();
        if (!settings) {
            return res.json({ status: 'success', data: {} });
        }
        const { googleMerchantToken, ...publicSettings } = settings;
        res.json({ status: 'success', data: publicSettings });
    });

    updateSettings = asyncHandler(async (req, res, next) => {
        const body = req.body || {};
        const data = {};

        if (body.kargoAgirlikCarpani !== undefined) data.kargoAgirlikCarpani = parseFloat(body.kargoAgirlikCarpani);
        if (body.ambarEsikAgirlik !== undefined) data.ambarEsikAgirlik = parseInt(body.ambarEsikAgirlik, 10);
        if (body.ucretsizKargoAltLimit !== undefined) data.ucretsizKargoAltLimit = parseFloat(body.ucretsizKargoAltLimit);
        if (body.kargoFiyatListesi !== undefined) {
            data.kargoFiyatListesi = typeof body.kargoFiyatListesi === 'object'
                ? JSON.stringify(body.kargoFiyatListesi)
                : body.kargoFiyatListesi;
        }
        if (body.kargoPolitikaTuru !== undefined) data.kargoPolitikaTuru = body.kargoPolitikaTuru;
        if (body.kargoSabitUcret !== undefined) data.kargoSabitUcret = parseFloat(body.kargoSabitUcret);
        if (body.maintenanceMode !== undefined) data.maintenanceMode = !!body.maintenanceMode;

        if (body.siteAdi !== undefined) data.siteAdi = body.siteAdi;
        if (body.iletisimEmail !== undefined) data.iletisimEmail = body.iletisimEmail || null;
        if (body.whatsappNumarasi !== undefined) data.whatsappNumarasi = body.whatsappNumarasi || null;
        if (body.telefon !== undefined) data.telefon = body.telefon || null;
        if (body.adres !== undefined) data.adres = body.adres || null;

        if (body.instagramUrl !== undefined) data.instagramUrl = body.instagramUrl || null;
        if (body.facebookUrl !== undefined) data.facebookUrl = body.facebookUrl || null;
        if (body.twitterUrl !== undefined) data.twitterUrl = body.twitterUrl || null;
        if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl || null;

        if (body.metaPixelId !== undefined) data.metaPixelId = body.metaPixelId || null;
        if (body.googleMerchantToken !== undefined) data.googleMerchantToken = body.googleMerchantToken || null;
        if (body.gtmContainerId !== undefined) data.gtmContainerId = body.gtmContainerId || null;
        if (body.ga4MeasurementId !== undefined) data.ga4MeasurementId = body.ga4MeasurementId || null;

        if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl || null;
        if (body.logoMode !== undefined) data.logoMode = body.logoMode || 'image';
        if (body.faviconUrl !== undefined) data.faviconUrl = body.faviconUrl || null;

        if (body.posKedah !== undefined) data.posKedah = parseFloat(body.posKedah);
        if (body.posSemenanjung !== undefined) data.posSemenanjung = parseFloat(body.posSemenanjung);
        if (body.posBorneo !== undefined) data.posBorneo = parseFloat(body.posBorneo);

        if (body.hakkindaMetni !== undefined) data.hakkindaMetni = body.hakkindaMetni || null;
        if (body.adminEmail !== undefined) data.adminEmail = body.adminEmail || null;
        if (body.adminPin !== undefined) data.adminPin = body.adminPin || null;

        const settings = await this.settingsService.updateSettings(data);
        res.json({ status: 'success', data: settings });
    });
}
