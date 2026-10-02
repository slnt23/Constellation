package com.relax.owl.common.exception;


import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import com.relax.owl.common.result.Result;
import com.relax.owl.common.result.ResultStatus;

import java.util.stream.Collectors;

/**
 * 全局异常处理器，
 * 日志打印的错误是提醒自己，不是返回前端的
 *
 * @author slnt23
 * @since 2025/11/19
 */

@Slf4j
@RestControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {


    /**
     * 自定义业务异常1
     * @param e 业务异常
     * @return 统一响应
     */
    @ExceptionHandler(value = BizException.class)
    public Result<?> handleBiz(BizException e) {
        log.warn("业务异常{}",e.getMessage(), e);
        // 回传具体的业务码与提示：否则前端只能看到「业务异常」，
        // 分不清是旧密码错误、邮箱已被占用还是文件超限
        return Result.fail(e.getCode(), e.getMessage());
    }

    /**
     * 登录认证异常
     * @param e 登录异常
     * @return 统一响应
     */
    @ExceptionHandler(value = LoginFailureException.class)
    public Result<?> handleLoginFailure(LoginFailureException e) {
        log.warn("登录异常：{}", e.getMessage());
        // 同上：回传具体原因，前端才能区分验证码错误、账号禁用等场景
        return Result.fail(e.getCode(), e.getMessage());
    }

    /**
     * 方法级权限不足（@PreAuthorize 等）
     * @param e 权限异常
     * @return 统一响应
     */
    @ExceptionHandler(value = org.springframework.security.access.AccessDeniedException.class)
    public Result<?> handleAccessDenied(org.springframework.security.access.AccessDeniedException e) {
        log.warn("权限不足：{}", e.getMessage());
        return Result.fail(ResultStatus.FORBIDDEN);
    }

    /**
     * [UPGRADE] 唯一索引冲突统一返回数据已存在。
     */
    @ExceptionHandler(value = DuplicateKeyException.class)
    public Result<?> handleDuplicateKey(DuplicateKeyException e) {
        log.warn("唯一键冲突：{}", e.getMessage());
        return Result.fail(ResultStatus.DATA_ALREADY_EXIST);
    }

    /**
     * [UPGRADE] 上传文件超过大小限制。
     */
    @ExceptionHandler(value = MaxUploadSizeExceededException.class)
    public Result<?> handleMaxUploadSize(MaxUploadSizeExceededException e) {
        log.warn("上传文件超限：{}", e.getMessage());
        // 这里是 multipart 容器级限制，对图片/视频/文档都适用，
        // 因此不能用写死为「图片大小不能超过 5MB」的 FILE_SIZE_EXCEEDED
        return Result.fail(ResultStatus.UPLOAD_SIZE_EXCEEDED);
    }

    /**
     * 参数校验异常
     * @param e @Valid @Validated校验
     * @return 自定义
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public Result<?> handleValid(Exception e) {
        // Spring 6+ 起 MethodArgumentNotValidException 继承自 BindException，两者可统一取值；
        // 这里用 instanceof 兜底，取不到字段信息时再退回枚举默认文案
        String msg = "";
        if (e instanceof BindException bindException) {
            msg = bindException.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .filter(message -> message != null && !message.isBlank())
                    .collect(Collectors.joining("；"));
        }
        if (msg.isBlank()) {
            msg = ResultStatus.PARAMS_INVALID.getMessage();
        }

        log.warn("参数校验失败：{}",msg,e);
        // 回传具体字段提示，否则前端只能看到笼统的「参数校验失败」
        return Result.fail(ResultStatus.PARAMS_INVALID.getCode(), msg);
    }

    /**
     * 方法不支持（405）
     * @param e 不支持异常
     * @return 自定义
     */
    @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public Result<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {

        log.warn("请求不支持：{}",e.getMessage(),e);
        return Result.fail(ResultStatus.METHOD_NOT_ALLOWED);
    }

    /**
     * 404 找不到资源
     * @param e NoFound
     * @return 自定义
     */
    @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Result<?> handleNoHandlerFound(Exception e) {

        log.warn("资源不存在：{}", e.getMessage());
        return Result.fail(ResultStatus.NOT_FOUND);
    }


    /**
     * 全局通用异常处理，兜底
     * @param e 异常类型，
     * @return 回显数据
     */
    @ExceptionHandler(value = Exception.class)
    public Result<?> exceptionHandler(Exception e) {

        log.error("发生错误，未捕获具体异常，报错信息：{}",e.getMessage(),e);
        return Result.fail(ResultStatus.FAIL);
    }
}
