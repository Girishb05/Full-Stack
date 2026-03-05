package com.shopease.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.shopease.dao.UserDAO;
import com.shopease.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();

        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        JsonObject result = new JsonObject();

        if ("/login".equals(path)) {
            handleLogin(json, req, result);
        } else if ("/register".equals(path)) {
            handleRegister(json, result);
        } else if ("/logout".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session != null)
                session.invalidate();
            result.addProperty("success", true);
        } else {
            resp.setStatus(404);
            result.addProperty("error", "Not found");
        }

        resp.getWriter().write(result.toString());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();
        JsonObject result = new JsonObject();

        if ("/session".equals(path)) {
            HttpSession session = req.getSession(false);
            if (session != null && session.getAttribute("userId") != null) {
                int userId = (int) session.getAttribute("userId");
                User user = userDAO.findById(userId);
                if (user != null) {
                    result.addProperty("loggedIn", true);
                    result.addProperty("userId", user.getId());
                    result.addProperty("name", user.getName());
                    result.addProperty("email", user.getEmail());
                    result.addProperty("role", user.getRole());
                } else {
                    result.addProperty("loggedIn", false);
                }
            } else {
                result.addProperty("loggedIn", false);
            }
        }

        resp.getWriter().write(result.toString());
    }

    private void handleLogin(JsonObject json, HttpServletRequest req, JsonObject result) {
        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();

        User user = userDAO.login(email, password);
        if (user != null) {
            HttpSession session = req.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getName());
            session.setAttribute("userRole", user.getRole());
            session.setMaxInactiveInterval(30 * 60); // 30 min

            result.addProperty("success", true);
            result.addProperty("name", user.getName());
            result.addProperty("role", user.getRole());
        } else {
            result.addProperty("success", false);
            result.addProperty("error", "Invalid email or password");
        }
    }

    private void handleRegister(JsonObject json, JsonObject result) {
        String name = json.get("name").getAsString();
        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();

        if (userDAO.emailExists(email)) {
            result.addProperty("success", false);
            result.addProperty("error", "Email already registered");
            return;
        }

        User user = new User(name, email, password);
        if (json.has("phone"))
            user.setPhone(json.get("phone").getAsString());
        if (json.has("address"))
            user.setAddress(json.get("address").getAsString());

        if (userDAO.register(user)) {
            result.addProperty("success", true);
            result.addProperty("message", "Registration successful! Please login.");
        } else {
            result.addProperty("success", false);
            result.addProperty("error", "Registration failed. Try again.");
        }
    }
}
