import { BaseRepository } from './baseRepository.js';

export class SettingsRepository extends BaseRepository {
    constructor(dbClient) {
        super(dbClient.sistemAyarlari);
    }

    async getSettings() {
        let settings = await this.model.findUnique({
            where: { id: 'global-settings' }
        });
        if (!settings) {
            settings = await this.model.create({
                data: {
                    id: 'global-settings',
                    siteAdi: "DIN'O EMPIRE",
                    maintenanceMode: false
                }
            });
        }
        return settings;
    }

    async createSettings(data) {
        return this.model.create({
            data: {
                id: 'global-settings',
                ...data
            }
        });
    }

    async updateSettings(data) {
        return this.model.upsert({
            where: { id: 'global-settings' },
            create: {
                id: 'global-settings',
                siteAdi: data.siteAdi || "DIN'O EMPIRE",
                ...data
            },
            update: data
        });
    }
}
