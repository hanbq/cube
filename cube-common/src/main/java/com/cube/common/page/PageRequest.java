package com.cube.common.page;

import java.io.Serial;
import java.io.Serializable;

/**
 * 分页请求参数
 *
 * @author cube
 * @since 2025-12-24
 */
public class PageRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 当前页码（从1开始）
     */
    private int pageNum;

    /**
     * 每页大小
     */
    private int pageSize;

    /**
     * 默认构造函数
     */
    public PageRequest() {
        this(1, 10);
    }

    /**
     * 构造函数
     *
     * @param pageNum  当前页码（从1开始）
     * @param pageSize 每页大小
     */
    public PageRequest(int pageNum, int pageSize) {
        this.pageNum = Math.max(pageNum, 1);
        this.pageSize = Math.max(pageSize, 1);
    }

    /**
     * 获取偏移量（用于数据库查询）
     *
     * @return 偏移量
     */
    public int getOffset() {
        return (pageNum - 1) * pageSize;
    }

    /**
     * 获取限制数量（用于数据库查询）
     *
     * @return 限制数量
     */
    public int getLimit() {
        return pageSize;
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = Math.max(pageNum, 1);
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = Math.max(pageSize, 1);
    }

    /**
     * 创建分页请求
     *
     * @param pageNum  当前页码
     * @param pageSize 每页大小
     * @return 分页请求对象
     */
    public static PageRequest of(int pageNum, int pageSize) {
        return new PageRequest(pageNum, pageSize);
    }

    @Override
    public String toString() {
        return "PageRequest{" +
                "pageNum=" + pageNum +
                ", pageSize=" + pageSize +
                ", offset=" + getOffset() +
                ", limit=" + getLimit() +
                '}';
    }
}
