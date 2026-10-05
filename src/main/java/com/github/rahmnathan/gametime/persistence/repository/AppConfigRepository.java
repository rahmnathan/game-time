package com.github.rahmnathan.gametime.persistence.repository;

import com.github.rahmnathan.gametime.persistence.entity.AppConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppConfigRepository extends JpaRepository<AppConfig, String> {
}
