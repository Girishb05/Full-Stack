package com.shopease.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.shopease.dao.CartDAO;
import com.shopease.model.CartItem;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {

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

        String path = req.getPathInfo();
        if ("/count".equals(path)) {
            int count = cartDAO.getCartCount(userId);
            resp.getWriter().write("{\"count\":" + count + "}");
        } else {
            List<CartItem> items = cartDAO.getCartItems(userId);
            BigDecimal total = items.stream()
                    .map(CartItem::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> result = new HashMap<>();
            result.put("items", items);
            result.put("total", total);
            result.put("itemCount", items.stream().mapToInt(CartItem::getQuantity).sum());
            resp.getWriter().write(gson.toJson(result));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        Integer userId = getUserId(req);
        if (userId == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"error\":\"Please login to add items to cart\"}");
            return;
        }

        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        int productId = json.get("productId").getAsInt();
        int quantity = json.has("quantity") ? json.get("quantity").getAsInt() : 1;

        boolean success = cartDAO.addToCart(userId, productId, quantity);
        JsonObject result = new JsonObject();
        result.addProperty("success", success);
        if (success) {
            result.addProperty("cartCount", cartDAO.getCartCount(userId));
        }
        resp.getWriter().write(result.toString());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        Integer userId = getUserId(req);
        if (userId == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"error\":\"Not logged in\"}");
            return;
        }

        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        int productId = json.get("productId").getAsInt();
        int quantity = json.get("quantity").getAsInt();

        boolean success = cartDAO.updateQuantity(userId, productId, quantity);
        JsonObject result = new JsonObject();
        result.addProperty("success", success);
        result.addProperty("cartCount", cartDAO.getCartCount(userId));
        resp.getWriter().write(result.toString());
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        Integer userId = getUserId(req);
        if (userId == null) {
            resp.setStatus(401);
            resp.getWriter().write("{\"error\":\"Not logged in\"}");
            return;
        }

        String path = req.getPathInfo();
        boolean success;
        if ("/clear".equals(path)) {
            success = cartDAO.clearCart(userId);
        } else {
            int productId = Integer.parseInt(path.substring(1));
            success = cartDAO.removeFromCart(userId, productId);
        }

        JsonObject result = new JsonObject();
        result.addProperty("success", success);
        result.addProperty("cartCount", cartDAO.getCartCount(userId));
        resp.getWriter().write(result.toString());
    }

    private Integer getUserId(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null)
            return null;
        return (Integer) session.getAttribute("userId");
    }
}
