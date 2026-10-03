package com.mtech.employee_directory;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    private final EmployeeRepository repo;
    private final EmployeeSearchDao searchDao;

    public EmployeeController(EmployeeRepository repo, EmployeeSearchDao searchDao) {
        this.repo = repo;
        this.searchDao = searchDao;
    }

    @GetMapping
    public List<Employee> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Employee one(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }

    @PostMapping
    public Employee create(@RequestBody Employee e) { return repo.save(e); }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @RequestBody Employee e) {
        e.setId(id);
        return repo.save(e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }

    @GetMapping("/search")
    public List<Map<String, Object>> search(@RequestParam String name) {
        return searchDao.searchByName(name);
    }
}
