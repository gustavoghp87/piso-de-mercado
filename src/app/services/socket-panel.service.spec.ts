import { TestBed } from '@angular/core/testing';

import { SocketPanelService } from './socket-panel.service';

describe('SocketPanelService', () => {
  let service: SocketPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
