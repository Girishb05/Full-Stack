package com.shopease.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.shopease.dao.CartDAO;
import com.shopease.dao.OrderDAO;
import com.shopease.model.CartItem;
import com.shopease.model.Order;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/orders")
public class OrderServlet extends HttpServlet {

    private final OrderDAO orderDAO = new OrderDAO();
    private final CartDAO cartDAO = new CartDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        Integer userId = getUserId(req);
        if (userId == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"error\":\"Not logged in\"}");
            return;
        }

        List<Order> orders = orderDAO.findByUserId(userId);
        resp.getWriter().write(gson.toJson(orders));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        Integer userId = getUserId(req);
        if (userId == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"success\":false,\"error\":\"Not logged in\"}");
            return;
        }

        try {
            JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
            if (json == null || !json.has("shippingAddress")) {
                resp.setStatus(400);
                resp.getWriter().write("{\"success\":false,\"error\":\"Missing shipping address\"}");
                return;
            }

            String address = json.get("shippingAddress").getAsString();
            String payment = json.has("paymentMethod") ? json.get("paymentMethod").getAsString() : "COD";

            // Support selective ordering
            List<CartItem> cartItems = cartDAO.getCartItems(userId);
            if (json.has("selectedProductIds") && !json.get("selectedProductIds").isJsonNull()) {
                final List<Integer> selectedIds = new java.util.ArrayList<>();
                json.get("selectedProductIds").getAsJsonArray().forEach(el -> {
                    if (el.isJsonPrimitive() && el.getAsJsonPrimitive().isNumber()) {
                        selectedIds.add(el.getAsInt());
                    }
                });

                if (!selectedIds.isEmpty()) {
                    cartItems.removeIf(item -> !selectedIds.contains(item.getProductId()));
                }
            }

            if (cartItems.isEmpty()) {
                resp.setStatus(400);
                resp.getWriter().write("{\"success\":false,\"error\":\"No items selected for order\"}");
                return;
            }

            int orderId = orderDAO.placeOrder(userId, address, payment, cartItems);
            JsonObject result = new JsonObject();
            if (orderId > 0) {
                result.addProperty("success", true);
                result.addProperty("orderId", orderId);
                result.addProperty("message", "Order placed successfully!");
            } else {
                result.addProperty("success", false);
                result.addProperty("error", "Failed to place order. Please check stock availability or connectivity.");
            }
            resp.getWriter().write(result.toString());

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(500);
            resp.getWriter().write("{\"success\":false,\"error\":\"Internal server error: " + e.getMessage() + "\"}");
        }
    }

    private Integer getUserId(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null)
            return null;
        return (Integer) session.getAttribute("userId");
    }
}
