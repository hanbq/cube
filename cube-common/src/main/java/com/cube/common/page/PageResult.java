package com.cube.common.page;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;

/**
 * 分页结果
 *
 * @param <T> 数据类型
 * @author cube
 * @since 2025-12-24
 */
public class PageResult<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private int pageNum;

    /**
     * 每页大小
     */
    private int pageSize;

    /**
     * 总记录数
     */
    private long total;

    /**
     * 总页数
     */
    private int pages;

    /**
     * 当前页数据
     */
    private List<T> records;

    /**
     * 默认构造函数
     */
    public PageResult() {
        this.records = Collections.emptyList();
    }

    /**
     * 构造函数
     *
     * @param pageNum  当前页码
     * @param pageSize 每页大小
     * @param total    总记录数
     * @param records  当前页数据
     */
    public PageResult(int pageNum, int pageSize, long total, List<T> records) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
        this.records = records == null ? Collections.emptyList() : records;
        this.pages = calculatePages(total, pageSize);
    }

    /**
     * 计算总页数
     *
     * @param total    总记录数
     * @param pageSize 每页大小
     * @return 总页数
     */
    private int calculatePages(long total, int pageSize) {
        if (pageSize == 0) {
            return 0;
        }
        return (int) ((total + pageSize - 1) / pageSize);
    }

    /**
     * 是否有上一页
     *
     * @return true-有上一页，false-没有
     */
    public boolean hasPrevious() {
        return pageNum > 1;
    }

    /**
     * 是否有下一页
     *
     * @return true-有下一页，false-没有
     */
    public boolean hasNext() {
        return pageNum < pages;
    }

    /**
     * 是否第一页
     *
     * @return true-是第一页，false-不是
     */
    public boolean isFirst() {
        return pageNum == 1;
    }

    /**
     * 是否最后一页
     *
     * @return true-是最后一页，false-不是
     */
    public boolean isLast() {
        return pageNum == pages;
    }

    /**
     * 获取当前页数据数量
     *
     * @return 当前页数据数量
     */
    public int getSize() {
        return records.size();
    }

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
        this.pages = calculatePages(total, pageSize);
    }

    public int getPages() {
        return pages;
    }

    public List<T> getRecords() {
        return records;
    }

    public void setRecords(List<T> records) {
        this.records = records == null ? Collections.emptyList() : records;
    }

    /**
     * 创建空的分页结果
     *
     * @param pageNum  当前页码
     * @param pageSize 每页大小
     * @param <T>      数据类型
     * @return 空的分页结果
     */
    public static <T> PageResult<T> empty(int pageNum, int pageSize) {
        return new PageResult<>(pageNum, pageSize, 0, Collections.emptyList());
    }

    /**
     * 创建分页结果
     *
     * @param pageRequest 分页请求
     * @param total       总记录数
     * @param records     当前页数据
     * @param <T>         数据类型
     * @return 分页结果
     */
    public static <T> PageResult<T> of(PageRequest pageRequest, long total, List<T> records) {
        return new PageResult<>(pageRequest.getPageNum(), pageRequest.getPageSize(), total, records);
    }

    @Override
    public String toString() {
        return "PageResult{" +
                "pageNum=" + pageNum +
                ", pageSize=" + pageSize +
                ", total=" + total +
                ", pages=" + pages +
                ", size=" + getSize() +
                ", hasPrevious=" + hasPrevious() +
                ", hasNext=" + hasNext() +
                '}';
    }
}
