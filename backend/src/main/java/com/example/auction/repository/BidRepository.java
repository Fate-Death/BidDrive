package com.example.auction.repository;

import com.example.auction.model.Bid;
import com.example.auction.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByCarOrderByAmountDesc(Car car);
    List<Bid> findByBidderId(Long bidderId);
}
