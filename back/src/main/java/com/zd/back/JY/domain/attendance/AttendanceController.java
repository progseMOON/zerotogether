package com.zd.back.JY.domain.attendance;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/list/{memId}")
    public ResponseEntity<List<AttendanceDTO>> getMonthlyAttendance(
            @PathVariable String memId,
            @RequestParam int year,
            @RequestParam int month) {
        List<AttendanceDTO> attendance = attendanceService.getMonthlyAttendance(memId, year, month);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/dates")
    public ResponseEntity<List<Date>> getAttendanceDates(@RequestParam String memId) {
        List<Date> attendanceDates = attendanceService.getAttendanceDates(memId);
        return ResponseEntity.ok(attendanceDates);
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkAttendance(@RequestParam String memId) {
        try {
            System.out.println(attendanceService.checkToday(memId));;
            attendanceService.insertAtt(memId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "출석 체크 성공");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/count/{memId}")
    public ResponseEntity<Integer> getMonthlyAttendanceCount(@PathVariable String memId) {
        int count = attendanceService.countMonthlyAttendance(memId);
        return ResponseEntity.ok(count);
    }
}
