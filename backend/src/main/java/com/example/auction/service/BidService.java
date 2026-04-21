package com.example.auction.service;

import com.example.auction.model.Bid;
import com.example.auction.model.Car;
import com.example.auction.model.User;
import com.example.auction.repository.BidRepository;
import com.example.auction.repository.CarRepository;
import com.example.auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Bid placeBid(Long carId, Double amount) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User bidder = userRepository.findByUsername(username).orElseThrow();
        Car car = carRepository.findById(carId).orElseThrow();

        // FIX: prevent seller from bidding on their own car
        if (car.getSeller() != null && car.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You cannot bid on your own listing");
        }

        if (amount <= car.getCurrentPrice()) {
            throw new RuntimeException("Bid amount must be higher than current price: $" + car.getCurrentPrice());
        }

        if (!"ACTIVE".equals(car.getStatus())) {
            throw new RuntimeException("Auction is closed for this car");
        }

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setBidder(bidder);
        bid.setCar(car);
        bid.setBidTime(LocalDateTime.now());

        car.setCurrentPrice(amount);
        carRepository.save(car);

        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForCar(Long carId) {
        Car car = carRepository.findById(carId).orElseThrow();
        return bidRepository.findByCarOrderByAmountDesc(car);
    }
}
