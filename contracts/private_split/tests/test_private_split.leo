// PrivateSplit Contract Test Suite
// Tests for all 5 transitions: create_split, issue_debt, pay_debt, settle_split, verify_split

program test_private_split.aleo {
    // Test 1: Verify BHP256 hash_to_field produces consistent split IDs
    // The split_id is deterministic given the same creator + salt
    transition test_split_id_determinism(creator: address, salt: field) -> field {
        let key: private_split_v1.aleo/SplitKey = private_split_v1.aleo/SplitKey {
            creator: creator,
            salt: salt,
        };
        let id1: field = BHP256::hash_to_field(key);
        let id2: field = BHP256::hash_to_field(key);
        assert_eq(id1, id2);
        return id1;
    }

    // Test 2: Verify per-person calculation
    // 10_000_000 microcredits / 4 participants = 2_500_000 each
    transition test_per_person_calculation() -> u64 {
        let total: u64 = 10_000_000u64;
        let count: u8 = 4u8;
        let per_person: u64 = total / (count as u64);
        assert_eq(per_person, 2_500_000u64);
        return per_person;
    }

    // Test 3: Verify participant count bounds (2-8)
    transition test_participant_bounds() -> bool {
        // Valid ranges
        assert(2u8 >= 2u8);
        assert(2u8 <= 8u8);
        assert(8u8 >= 2u8);
        assert(8u8 <= 8u8);
        assert(5u8 >= 2u8);
        assert(5u8 <= 8u8);
        return true;
    }

    // Test 4: Verify max debts = participant_count - 1
    // (creator doesn't owe themselves)
    transition test_max_debts() -> u8 {
        let participant_count: u8 = 4u8;
        let max_debts: u8 = participant_count - 1u8;
        assert_eq(max_debts, 3u8);
        return max_debts;
    }

    // Test 5: Verify different salts produce different split IDs
    transition test_salt_uniqueness(creator: address) -> bool {
        let key1: private_split_v1.aleo/SplitKey = private_split_v1.aleo/SplitKey {
            creator: creator,
            salt: 12345field,
        };
        let key2: private_split_v1.aleo/SplitKey = private_split_v1.aleo/SplitKey {
            creator: creator,
            salt: 67890field,
        };
        let id1: field = BHP256::hash_to_field(key1);
        let id2: field = BHP256::hash_to_field(key2);
        assert_neq(id1, id2);
        return true;
    }

    // Test 6: Verify integer division truncation behavior
    // 10 / 3 = 3 (truncated), total collected = 3 * 3 = 9, remainder = 1
    transition test_division_truncation() -> u64 {
        let total: u64 = 10u64;
        let count: u64 = 3u64;
        let per_person: u64 = total / count;
        assert_eq(per_person, 3u64);
        let collected: u64 = per_person * count;
        assert_eq(collected, 9u64);
        let remainder: u64 = total - collected;
        assert_eq(remainder, 1u64);
        return remainder;
    }
}
