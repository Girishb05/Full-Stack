package com.shopease.servlet;

import com.google.gson.Gson;
import com.shopease.dao.ProductDAO;
import com.shopease.model.Product;
import com.shopease.model.Category;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/products/*")
public class ProductServlet extends HttpServlet {

    private final ProductDAO productDAO = new ProductDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();

        if (path == null || "/".equals(path)) {
            // GET /api/products — list with filters
            String category = req.getParameter("category");
            String search = req.getParameter("search");
            String sort = req.getParameter("sort");
            List<Product> products = productDAO.findAll(category, search, sort);
            resp.getWriter().write(gson.toJson(products));

        } else if ("/featured".equals(path)) {
            // GET /api/products/featured
            List<Product> featured = productDAO.findFeatured();
            resp.getWriter().write(gson.toJson(featured));

        } else if ("/categories".equals(path)) {
            // GET /api/products/categories
            List<Category> categories = productDAO.findAllCategories();
            resp.getWriter().write(gson.toJson(categories));

        } else {
            // GET /api/products/{id}
            try {
                int id = Integer.parseInt(path.substring(1));
                Product product = productDAO.findById(id);
                if (product != null) {
                    resp.getWriter().write(gson.toJson(product));
                } else {
                    resp.setStatus(404);
                    Map<String, String> err = new HashMap<>();
                    err.put("error", "Product not found");
                    resp.getWriter().write(gson.toJson(err));
                }
            } catch (NumberFormatException e) {
                resp.setStatus(400);
                Map<String, String> err = new HashMap<>();
                err.put("error", "Invalid product ID");
                resp.getWriter().write(gson.toJson(err));
            }
        }
    }
}
