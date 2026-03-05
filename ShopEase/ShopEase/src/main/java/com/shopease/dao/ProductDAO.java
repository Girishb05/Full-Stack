package com.shopease.dao;

import com.shopease.model.Product;
import com.shopease.model.Category;
import com.shopease.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    /** Get all products, optionally filtered */
    public List<Product> findAll(String category, String search, String sort) {
        StringBuilder sql = new StringBuilder(
                "SELECT p.*, c.name AS category_name FROM products p " +
                        "LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (category != null && !category.isEmpty()) {
            sql.append(" AND c.name = ?");
            params.add(category);
        }
        if (search != null && !search.isEmpty()) {
            sql.append(" AND (p.name LIKE ? OR p.description LIKE ?)");
            params.add("%" + search + "%");
            params.add("%" + search + "%");
        }

        if ("price_asc".equals(sort)) {
            sql.append(" ORDER BY p.price ASC");
        } else if ("price_desc".equals(sort)) {
            sql.append(" ORDER BY p.price DESC");
        } else if ("rating".equals(sort)) {
            sql.append(" ORDER BY p.rating DESC");
        } else if ("newest".equals(sort)) {
            sql.append(" ORDER BY p.created_at DESC");
        } else {
            sql.append(" ORDER BY p.featured DESC, p.rating DESC");
        }

        List<Product> products = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                products.add(mapProduct(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return products;
    }

    /** Get featured products */
    public List<Product> findFeatured() {
        String sql = "SELECT p.*, c.name AS category_name FROM products p " +
                "LEFT JOIN categories c ON p.category_id = c.id " +
                "WHERE p.featured = TRUE ORDER BY p.rating DESC";
        List<Product> products = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                products.add(mapProduct(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return products;
    }

    /** Get product by ID */
    public Product findById(int id) {
        String sql = "SELECT p.*, c.name AS category_name FROM products p " +
                "LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next())
                return mapProduct(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /** Get all categories */
    public List<Category> findAllCategories() {
        String sql = "SELECT * FROM categories ORDER BY name";
        List<Category> categories = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Category c = new Category();
                c.setId(rs.getInt("id"));
                c.setName(rs.getString("name"));
                c.setDescription(rs.getString("description"));
                c.setImageUrl(rs.getString("image_url"));
                categories.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }

    /** Reduce stock after purchase */
    public boolean reduceStock(int productId, int quantity) {
        String sql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, productId);
            ps.setInt(3, quantity);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private Product mapProduct(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setId(rs.getInt("id"));
        p.setName(rs.getString("name"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setOriginalPrice(rs.getBigDecimal("original_price"));
        p.setImageUrl(rs.getString("image_url"));
        p.setStock(rs.getInt("stock"));
        p.setCategoryId(rs.getInt("category_id"));
        p.setCategoryName(rs.getString("category_name"));
        p.setRating(rs.getDouble("rating"));
        p.setReviewCount(rs.getInt("review_count"));
        p.setFeatured(rs.getBoolean("featured"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        return p;
    }
}
