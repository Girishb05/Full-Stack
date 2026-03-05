package com.shopease.model;

public class OrderWithUser {
    private Order order;
    private User user;

    public OrderWithUser(Order order, User user) {
        this.order = order;
        this.user = user;
    }

    public Order getOrder() {
        return order;
    }

    public User getUser() {
        return user;
    }
}
