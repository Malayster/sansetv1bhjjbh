import { z } from 'zod';

const phoneRegex = /^((\+?60)?0?1[0-9]{8,9}|01[0-9]{7,9})$/; // Format nombor telefon Malaysia
const taxNumberRegex = /^[0-9]{9,12}$/;

export const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.coerce.number().int().positive(),
        name: z.string().optional(),
        price: z.coerce.number().optional(),
        selectedColor: z.string().trim().min(1).max(50).optional()
    })).nonempty("Troli pesanan tidak boleh kosong"),

    guestInfo: z.object({
        name: z.string().min(2, "Nama penuh sekurang-kurangnya 2 aksara"),
        email: z.string().email("Sila masukkan alamat e-mel yang sah"),
        phone: z.string().regex(phoneRegex, "Sila masukkan nombor telefon Malaysia yang sah (cth: 0123456789)"),
        address: z.string().min(8, "Sila masukkan alamat lengkap sekurang-kurangnya 8 aksara"),
        city: z.string().min(2, "Sila pilih Negeri"),
        district: z.string().min(2, "Sila pilih Daerah / Bandar"),
        zipCode: z.string().min(3, "Sila masukkan poskod yang sah")
    }),

    invoiceInfo: z.object({
        isCorporate: z.boolean(),
        companyName: z.string().optional(),
        taxOffice: z.string().optional(),
        taxNumber: z.string().optional()
    }).optional().refine((data) => {
        if (!data || !data.isCorporate) return true;
        // If corporate, these are required
        return data.companyName && data.taxNumber;
    }, {
        message: "Untuk invois korporat, Nama Syarikat dan No. Pendaftaran/Cukai diperlukan",
        path: ["companyName"]
    })
});
