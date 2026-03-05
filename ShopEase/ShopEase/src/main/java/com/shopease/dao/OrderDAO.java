package com.shopease.dao;

import com.shopease.model.CartItem;
import com.shopease.model.Order;
import com.shopease.model.OrderItem;
import com.shopease.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    /** Place an order from cart items */
    public int placeOrder(int userId, String shippingAddress, String paymentMethod,
            List<CartItem> cartItems) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // Calculate items subtotal
            BigDecimal itemsSubtotal = BigDecimal.ZERO;
            for (CartItem item : cartItems) {
                itemsSubtotal = itemsSubtotal.add(item.getSubtotal());
            }

            // Calculate Tax (5% GST)
            BigDecimal tax = itemsSubtotal.multiply(new BigDecimal("0.05"));

            // Calculate shipping charges (Free if subtotal >= 500)
            BigDecimal shippingCharges = (itemsSubtotal.compareTo(new BigDecimal("500.00")) >= 0)
                    ? BigDecimal.ZERO
                    : new BigDecimal("49.00");

            // Grand total = Subtotal + Tax + Shipping
            BigDecimal grandTotal = itemsSubtotal.add(tax).add(shippingCharges);

            // 1. Insert order
            String orderSql = "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, shipping_charges, expected_delivery_date) "
                    + "VALUES (?, ?, 'CONFIRMED', ?, ?, ?, ?)";

            int orderId = -1;
            try (PreparedStatement orderPs = conn.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS)) {
                orderPs.setInt(1, userId);
                orderPs.setBigDecimal(2, grandTotal);
                orderPs.setString(3, shippingAddress);
                orderPs.setString(4, paymentMethod);
                orderPs.setBigDecimal(5, shippingCharges);

                // Expected delivery: 4 days from now
                Timestamp expected = new Timestamp(System.currentTimeMillis() + (4L * 24 * 60 * 60 * 1000));
                orderPs.setTimestamp(6, expected);

                int affected = orderPs.executeUpdate();
                if (affected == 0)
                    throw new SQLException("Creating order failed, no rows affected.");

                try (ResultSet keys = orderPs.getGeneratedKeys()) {
                    if (keys.next()) {
                        orderId = keys.getInt(1);
                    } else {
                        throw new SQLException("Creating order failed, no ID obtained.");
                    }
                }
            }

            // 2. Insert order items + reduce stock
            String itemSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
            String stockSql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";

            try (PreparedStatement itemPs = conn.prepareStatement(itemSql);
                    PreparedStatement stockPs = conn.prepareStatement(stockSql)) {

                for (CartItem ci : cartItems) {
                    itemPs.setInt(1, orderId);
                    itemPs.setInt(2, ci.getProductId());
                    itemPs.setInt(3, ci.getQuantity());
                    itemPs.setBigDecimal(4, ci.getProductPrice());
                    itemPs.addBatch();

                    stockPs.setInt(1, ci.getQuantity());
                    stockPs.setInt(2, ci.getProductId());
                    stockPs.setInt(3, ci.getQuantity());
                    stockPs.addBatch();
                }
                itemPs.executeBatch();

                int[] stockResults = stockPs.executeBatch();
                for (int res : stockResults) {
                    if (res == 0)
                        throw new SQLException("Product out of stock or does not exist.");
                }
            }

            // 3. Selective Remove from cart
            String removeSql = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
            try (PreparedStatement removePs = conn.prepareStatement(removeSql)) {
                for (CartItem ci : cartItems) {
                    removePs.setInt(1, userId);
                    removePs.setInt(2, ci.getProductId());
                    removePs.addBatch();
                }
                removePs.executeBatch();
            }

            conn.commit();
            return orderId;

        } catch (SQLException e) {
            System.err.println("Order placement error: " + e.getMessage());
            e.printStackTrace();
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            return -1;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {
                }
            }
        }
    }

    /** Get all orders for a user */
    public List<Order> findByUserId(int userId) {
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        List<Order> orders = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Order o = new Order();
                o.setId(rs.getInt("id"));
                o.setUserId(rs.getInt("user_id"));
                o.setTotalAmount(rs.getBigDecimal("total_amount"));
                o.setStatus(rs.getString("status"));
                o.setShippingAddress(rs.getString("shipping_address"));
                o.setPaymentMethod(rs.getString("payment_method"));
                o.setCreatedAt(rs.getTimestamp("created_at"));
                o.setShippingCharges(rs.getBigDecimal("shipping_charges"));
                o.setExpectedDeliveryDate(rs.getTimestamp("expected_delivery_date"));
                o.setItems(findOrderItems(o.getId()));
                orders.add(o);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    /** Get items for a specific order */
    public List<OrderItem> findOrderItems(int orderId) {
        String sql = "SELECT oi.*, p.name AS product_name, p.image_url AS product_image " +
                "FROM order_items oi JOIN products p ON oi.product_id = p.id " +
                "WHERE oi.order_id = ?";
        List<OrderItem> items = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, orderId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                OrderItem item = new OrderItem();
                item.setId(rs.getInt("id"));
                item.setOrderId(rs.getInt("order_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setPrice(rs.getBigDecimal("price"));
                item.setProductName(rs.getString("product_name"));
                item.setProductImage(rs.getString("product_image"));
                items.add(item);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }

    /** Get a specific order by ID */
    public Order findById(int orderId) {
        String sql = "SELECT * FROM orders WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, orderId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Order o = new Order();
                o.setId(rs.getInt("id"));
                o.setUserId(rs.getInt("user_id"));
                o.setTotalAmount(rs.getBigDecimal("total_amount"));
                o.setStatus(rs.getString("status"));
                o.setShippingAddress(rs.getString("shipping_address"));
                o.setPaymentMethod(rs.getString("payment_method"));
                o.setCreatedAt(rs.getTimestamp("created_at"));
                o.setShippingCharges(rs.getBigDecimal("shipping_charges"));
                o.setExpectedDeliveryDate(rs.getTimestamp("expected_delivery_date"));
                o.setItems(findOrderItems(o.getId()));
                return o;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
