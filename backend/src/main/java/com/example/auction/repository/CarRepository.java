package com.example.auction.repository;

import com.example.auction.model.Car;
import com.example.auction.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(String status);
    List<Car> findBySeller(User seller);
}
