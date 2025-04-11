export default class UserProfileRepository {
    constructor(service) {
        this.service = service;
    }

    async getProfile() {
        return await this.service.get();
    }

    async saveProfile(profile) {
        await this.service.save(profile);
    }
}
