export class User {
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public city: string,
        public birthday: string,
        public score: number,
        public id?: string,
    ) {}
}
