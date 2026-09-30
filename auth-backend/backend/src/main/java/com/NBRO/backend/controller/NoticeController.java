package com.NBRO.backend.controller;

import com.NBRO.backend.entity.Notice;
import com.NBRO.backend.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin
public class NoticeController {

    private final NoticeService service;

    public NoticeController(NoticeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notice> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Notice getById(@PathVariable @org.springframework.lang.NonNull UUID id) {
        return service.getById(id);
    }

    @PostMapping
    public Notice create(@RequestBody @org.springframework.lang.NonNull Notice notice) {
        return service.create(notice);
    }

    @PutMapping("/{id}")
    public Notice update(@PathVariable @org.springframework.lang.NonNull UUID id,
                         @RequestBody @org.springframework.lang.NonNull Notice notice) {
        return service.update(id, notice);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @org.springframework.lang.NonNull UUID id) {
        service.delete(id);
    }
}