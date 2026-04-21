package com.example.auction.controller;

import com.example.auction.model.Bid;
import com.example.auction.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    @Autowired
    private BidService bidService;

    @PostMapping("/{carId}")
    public ResponseEntity<Bid> placeBid(
            @PathVariable("carId") Long carId,
            @RequestParam("amount") Double amount) {
        return ResponseEntity.ok(bidService.placeBid(carId, amount));
    }

    @GetMapping("/car/{carId}")
    public List<Bid> getBidsForCar(@PathVariable("carId") Long carId) {
        return bidService.getBidsForCar(carId);
    }
}
