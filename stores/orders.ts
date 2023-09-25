import { defineStore } from "pinia";
import { FoodItemInterface, SideItemInterface, PojoItemInterface } from "./items";

export interface OrderItemsInterface {
    item: FoodItemInterface;
    sideItems?: Set<PojoItemInterface>;
    variant?: PojoItemInterface;
    count?: number;
}

export const useOrdersStore = defineStore("orders", () => {
    const dataIsLoaded: Ref<Boolean> = ref(false);
    const orderItems: Ref<Map<String, OrderItemsInterface>> = ref(new Map());

    const route = useRoute();

    const resetOrders = () => {
        orderItems.value.clear();
        _saveToStorage();
    };

    const addOrderItem = (order: OrderItemsInterface) => {
        let count = 0;
        if (orderItems.value.has(order.item._id)) count = orderItems.value.get(order.item._id)?.count || 0;
        orderItems.value.set(order.item._id, { ...order, count: count + 1 });
        _saveToStorage();
    };

    const updateOrderItem = (order: OrderItemsInterface) => {
        if (!orderItems.value.has(order.item._id)) return;
        orderItems.value.set(order.item._id, { ...order, count: orderItems.value.get(order.item._id)?.count || 1 });
        _saveToStorage();
    };

    const removeOrderItem = (order: OrderItemsInterface) => {
        let count = 1;
        if (orderItems.value.has(order.item._id)) count = orderItems.value.get(order.item._id)?.count || 1;
        if (count > 1) orderItems.value.set(order.item._id, { ...order, count: count - 1 });
        else orderItems.value.delete(order.item._id);
        _saveToStorage();
    };

    const calculateTotal = () => {
        let total = 0;
        let discount = 0;
        for (const [id, row] of orderItems.value) {
            let rowPrice = row.variant?.price ?? row.item.price;
            for (const sideItem of row.sideItems || []) rowPrice += sideItem.price || 0;
            // rowPrice = rowPrice * (1 - (row.item.discountActive ? row.item.discountPercentage : 0) / 100);
            total += rowPrice * (row.count || 1);
            discount += rowPrice * ((row.item.discountActive ? row.item.discountPercentage : 0) / 100) * (row.count || 1);
        }
        return { total, discount };
    };

    const getTaxAndFees = () => {
        // TODO
        return 0;
    };

    const _saveToStorage = () => {
        const storedOrders: any = JSON.parse(localStorage.getItem(`orders`) || `{}`);

        const orders = [];
        for (const [k, v] of orderItems.value.entries()) {
            orders.push([k, { ...v, sideItems: Array.from(v.sideItems || []) }]);
        }
        storedOrders[route.params.brand_id.toString()] = orders;

        localStorage.setItem(`orders`, JSON.stringify(storedOrders));
    };

    return {
        dataIsLoaded,
        orderItems,
        resetOrders,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        calculateTotal,
        getTaxAndFees,
    };
});
