package com.example.auction.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private LocalDateTime bidTime;

    @ManyToOne
    @JoinColumn(name = "bidder_id")
    private User bidder;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    public Bid() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDateTime getBidTime() { return bidTime; }
    public void setBidTime(LocalDateTime bidTime) { this.bidTime = bidTime; }
    public User getBidder() { return bidder; }
    public void setBidder(User bidder) { this.bidder = bidder; }
    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }
}
