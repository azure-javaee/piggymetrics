package com.mp.piggymetrics.statistics.domain;

import com.mp.piggymetrics.statistics.repository.converter.BigDecimalConverter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.eclipse.jnosql.mapping.Convert;

import java.math.BigDecimal;

public class Item {

    @NotNull
    @Size(min = 1, max = 20)
    private String title;

    @NotNull
    @Convert(BigDecimalConverter.class)
    private BigDecimal amount;

    @NotNull
    private Currency currency;

    @NotNull
    private TimePeriod period;

    @NotNull
    private String icon;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public TimePeriod getPeriod() {
        return period;
    }

    public void setPeriod(TimePeriod period) {
        this.period = period;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
