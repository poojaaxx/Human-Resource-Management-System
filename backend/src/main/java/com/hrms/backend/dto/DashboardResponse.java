package com.hrms.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalEmployees;

    private long totalHrStaff;

    private long totalLeaves;

    private long pendingLeaves;

    private long approvedLeaves;

    private long rejectedLeaves;

}