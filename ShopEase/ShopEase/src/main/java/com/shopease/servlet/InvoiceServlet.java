package com.shopease.servlet;

import com.google.gson.Gson;
import com.shopease.dao.OrderDAO;
import com.shopease.dao.UserDAO;
import com.shopease.model.Order;
import com.shopease.model.OrderWithUser;
import com.shopease.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/api/orders/invoice")
public class InvoiceServlet extends HttpServlet {
    private final OrderDAO orderDAO = new OrderDAO();
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String orderIdStr = req.getParameter("id");
        if (orderIdStr == null) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Order ID is required\"}");
            return;
        }

        try {
            int orderId = Integer.parseInt(orderIdStr);
            Order order = orderDAO.findById(orderId);

            if (order == null) {
                resp.setStatus(404);
                resp.getWriter().write("{\"error\":\"Order not found\"}");
                return;
            }

            // Check if current user owns this order
            HttpSession session = req.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                resp.setStatus(401);
                resp.getWriter().write("{\"error\":\"Not logged in\"}");
                return;
            }

            int currentUserId = (Integer) session.getAttribute("userId");
            if (currentUserId != order.getUserId()) {
                resp.setStatus(403);
                resp.getWriter().write("{\"error\":\"Unauthorized access\"}");
                return;
            }

            User user = userDAO.findById(order.getUserId());
            OrderWithUser result = new OrderWithUser(order, user);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(gson.toJson(result));

        } catch (NumberFormatException e) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Invalid order ID\"}");
        }
    }
}
