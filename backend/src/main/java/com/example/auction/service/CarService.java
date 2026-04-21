package com.example.auction.service;

import com.example.auction.model.Car;
import com.example.auction.model.User;
import com.example.auction.repository.CarRepository;
import com.example.auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<Car> getActiveCars() {
        return carRepository.findByStatus("ACTIVE");
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public Car addCar(Car car) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username).orElseThrow();

        car.setSeller(seller);
        car.setCurrentPrice(car.getStartingPrice());
        car.setStatus("ACTIVE");
        car.setCreatedAt(LocalDateTime.now());

        return carRepository.save(car);
    }

    /** Close an auction — only the seller can do this */
    public Car closeAuction(Long carId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("Only the seller can close this auction");
        }
        if ("CLOSED".equals(car.getStatus())) {
            throw new RuntimeException("Auction is already closed");
        }

        car.setStatus("CLOSED");
        return carRepository.save(car);
    }

    /** Get all cars listed by the currently authenticated user */
    public List<Car> getMyCars() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByUsername(username).orElseThrow();
        return carRepository.findBySeller(seller);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}
