import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { DbService } from "./db.service";


describe("DbService", () => {
    let service: DbService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DbService]
        }).compileComponents();
        service = TestBed.inject(DbService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("get de usuarios", () => {
        expect(service.getUsuarios()).toBeTruthy();
    });
});
