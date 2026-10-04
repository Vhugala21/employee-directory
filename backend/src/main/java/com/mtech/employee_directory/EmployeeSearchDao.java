package com.mtech.employee_directory;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class EmployeeSearchDao {
    private final JdbcTemplate jdbc;

    public EmployeeSearchDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // FIXED: parameterized query, user input is bound as a value
    public List<Map<String, Object>> searchByName(String name) {
        String sql = "SELECT * FROM employee WHERE name LIKE ?";
        return jdbc.queryForList(sql, "%" + name + "%");
    }
}
