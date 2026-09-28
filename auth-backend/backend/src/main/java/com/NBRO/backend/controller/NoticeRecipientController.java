package com.NBRO.backend.controller;

import com.NBRO.backend.entity.NoticeRecipient;
import com.NBRO.backend.service.NoticeRecipientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notice-recipients")
@CrossOrigin
public class NoticeRecipientController {

    private final NoticeRecipientService service;

    public NoticeRecipientController(NoticeRecipientService service) {
        this.service = service;
    }

    @GetMapping
    public List<NoticeRecipient> getAll() {
        return service.getAll();
    }

    @GetMapping("/notice/{noticeId}")
    public List<NoticeRecipient> getByNoticeId(@PathVariable @org.springframework.lang.NonNull UUID noticeId) {
        return service.getByNoticeId(noticeId);
    }

    @GetMapping("/officer/{officerId}")
    public List<NoticeRecipient> getByOfficerId(@PathVariable @org.springframework.lang.NonNull UUID officerId) {
        return service.getByOfficerId(officerId);
    }

    @GetMapping("/{id}")
    public NoticeRecipient getById(@PathVariable @org.springframework.lang.NonNull UUID id) {
        return service.getById(id);
    }

    @PostMapping
    public NoticeRecipient create(@RequestBody @org.springframework.lang.NonNull NoticeRecipient recipient) {
        return service.create(recipient);
    }

    @PutMapping("/{id}")
    public NoticeRecipient update(@PathVariable @org.springframework.lang.NonNull UUID id,
                                  @RequestBody @org.springframework.lang.NonNull NoticeRecipient recipient) {
        return service.update(id, recipient);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @org.springframework.lang.NonNull UUID id) {
        service.delete(id);
    }
}