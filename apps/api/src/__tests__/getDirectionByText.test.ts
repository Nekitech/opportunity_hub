import { describe, expect, test } from "@jest/globals";

// Test direction data structures — pure objects, no `natural` dependency
import IT from "../helpers/getDirectionByText/directions/IT";
import Medicine from "../helpers/getDirectionByText/directions/Medicine";
import Design from "../helpers/getDirectionByText/directions/Design";

describe("Direction data integrity", () => {
    test("IT direction has name and non-empty props", () => {
        expect(IT.name).toBeTruthy();
        expect(Array.isArray(IT.props)).toBe(true);
        expect(IT.props.length).toBeGreaterThan(0);
    });

    test("Medicine direction has name and non-empty props", () => {
        expect(Medicine.name).toBeTruthy();
        expect(Array.isArray(Medicine.props)).toBe(true);
        expect(Medicine.props.length).toBeGreaterThan(0);
    });

    test("Design direction has name and non-empty props", () => {
        expect(Design.name).toBeTruthy();
        expect(Array.isArray(Design.props)).toBe(true);
        expect(Design.props.length).toBeGreaterThan(0);
    });

    test("all direction props are non-empty strings", () => {
        for (const dir of [IT, Medicine, Design]) {
            for (const prop of dir.props) {
                expect(typeof prop).toBe("string");
                expect(prop.trim().length).toBeGreaterThan(0);
            }
        }
    });

    test("direction names are unique across IT/Medicine/Design", () => {
        const names = [IT.name, Medicine.name, Design.name];
        expect(new Set(names).size).toBe(names.length);
    });
});
