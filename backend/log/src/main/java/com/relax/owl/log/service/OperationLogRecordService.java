package com.relax.owl.log.service;

import com.relax.owl.log.domain.message.OperationLogMessage;

/**
 * Handles persisted operation logs.
 */
public interface OperationLogRecordService {

    void addOperationLog(OperationLogMessage message);
}
