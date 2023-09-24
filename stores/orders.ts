import { defineStore } from "pinia";
import { FoodItemInterface, SideItemInterface, PojoItemInterface } from "./items";

export interface OrderItemsInterface {
    item: FoodItemInterface;
    sideItems?: Set<PojoItemInterface>;
    variant?: PojoItemInterface;
    count?: number;
}

export const useOrdersStore = defineStore("orders", () => {
    const orderItems: Ref<Map<String, OrderItemsInterface>> = ref(new Map());

    const resetOrders = () => {
        orderItems.value.clear();
    };

    const addOrderItem = async (order: OrderItemsInterface) => {
        let count = 0;
        if (orderItems.value.has(order.item._id)) count = orderItems.value.get(order.item._id)?.count || 0;
        orderItems.value.set(order.item._id, { ...order, count: count + 1 });
    };

    const updateOrderItem = async (order: OrderItemsInterface) => {
        if (!orderItems.value.has(order.item._id)) return;
        orderItems.value.set(order.item._id, { ...order, count: orderItems.value.get(order.item._id)?.count || 1 });
    };

    const removeOrderItem = async (order: OrderItemsInterface) => {
        let count = 1;
        if (orderItems.value.has(order.item._id)) count = orderItems.value.get(order.item._id)?.count || 1;
        if (count > 1) orderItems.value.set(order.item._id, { ...order, count: count - 1 });
        else orderItems.value.delete(order.item._id);
    };

    const calculateTotal = async () => {};

    const getTaxAndFees = async () => {};

    return {
        orderItems,
        resetOrders,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        calculateTotal,
        getTaxAndFees,
    };
});
