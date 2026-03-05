export type Order = {
    id: number,
    orderDate: string,
    deliveryDate: string,
    address: {
        fullAddress: string,
        id: number,
    },
    orderProducts: {
        amount: number,
        id: number,
        product: {
            amount: number,
            article: string,
            category: { id: number, name: string },
            description: string,
            discount: number,
            image: string,
            manufacturer: { id: number, name: string },
            name: string,
            price: number,
            provider: { id: number, name: string },
            unit: { id: number, name: string },
        },
    }[],
    user: {
        id: number,
        role: { id: number, name: string },
        fullName: string,
        username: string,
    },
    receiveCode: number,
    status: { id: number, name: string },
}