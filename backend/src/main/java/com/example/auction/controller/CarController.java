package com.example.auction.controller;

import com.example.auction.model.Car;
import com.example.auction.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping("/public/all")
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        return ResponseEntity.ok(carService.addCar(car));
    }

    /** Close the auction for a specific car — only the seller can do this */
    @PatchMapping("/{id}/close")
    public ResponseEntity<Car> closeAuction(@PathVariable("id") Long id) {
        return ResponseEntity.ok(carService.closeAuction(id));
    }

    /** Get all cars listed by the current authenticated user */
    @GetMapping("/my-listings")
    public ResponseEntity<List<Car>> getMyListings() {
        return ResponseEntity.ok(carService.getMyCars());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable("id") Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok("Car deleted successfully");
    }
}
