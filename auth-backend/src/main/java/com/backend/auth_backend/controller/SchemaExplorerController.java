package com.backend.auth_backend.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schema")
@CrossOrigin(origins = "*")
public class SchemaExplorerController {

    private static final List<String> TABLES = List.of(
            "profile",
            "site",
            "general_observation",
            "external_services",
            "ancillary_building",
            "detail_type",
            "building_detail",
            "main_building",
            "specification",
            "defects",
            "defect_info",
            "defect_image");

    private final JdbcTemplate jdbcTemplate;

    public SchemaExplorerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/tables")
    public ResponseEntity<List<Map<String, Object>>> listTables() {
        List<Map<String, Object>> response = new ArrayList<>();

        for (String tableName : TABLES) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", tableName);
            item.put("rowCount", countRows(tableName));
            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tables/{tableName}")
    public ResponseEntity<?> getTableData(@PathVariable String tableName) {
        if (!TABLES.contains(tableName)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unknown table",
                    "allowedTables", TABLES));
        }

        List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM \"" + tableName + "\"");
        List<String> columns = rows.isEmpty()
                ? fetchColumns(tableName)
                : new ArrayList<>(rows.get(0).keySet());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("table", tableName);
        payload.put("columns", columns);
        payload.put("rows", rows);
        payload.put("rowCount", rows.size());

        return ResponseEntity.ok(payload);
    }

    private long countRows(String tableName) {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM \"" + tableName + "\"",
                Long.class);
        return count == null ? 0L : count;
    }

    private List<String> fetchColumns(String tableName) {
        List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SELECT column_name FROM information_schema.columns WHERE table_name = ? ORDER BY ordinal_position",
                tableName);
        return columns.stream()
                .map(row -> String.valueOf(row.get("column_name")))
                .collect(Collectors.toList());
    }
}