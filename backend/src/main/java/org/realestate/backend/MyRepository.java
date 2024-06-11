package org.realestate.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyRepository extends JpaRepository<MyAPIData, Long> {
    // 추가적인 메서드가 필요하다면 여기에 작성하세요
}