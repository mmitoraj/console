import { Component, ViewChild } from '@angular/core';
import { IdpPresetsService } from '../idp-presets.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ModalComponent, ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-create-preset-modal',
  templateUrl: './create-preset-modal.component.html',
  styleUrls: ['./create-preset-modal.component.scss']
})
export class CreatePresetModalComponent {
  @ViewChild('createIDPPresetModal') createIDPPresetModal: ModalComponent;
  public presetName = '';
  public issuer = '';
  public jwks = '';
  public isActive = false;
  public wrongJwks = false;
  public wrongPresetName = false;
  public error = '';

  constructor(
    private idpPresetsService: IdpPresetsService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  show() {
    this.isActive = true;
    this.modalService.open(this.createIDPPresetModal).result.finally(() => {
      this.isActive = false;
      this.presetName = '';
      this.issuer = '';
      this.jwks = '';
      this.error = '';
      this.wrongJwks = false;
      this.wrongPresetName = false;
    });
  }

  close() {
    this.modalService.close(this.createIDPPresetModal);
  }

  isReadyToCreate() {
    return (
      this.presetName &&
      this.issuer &&
      this.jwks &&
      !this.wrongJwks &&
      !this.wrongPresetName
    );
  }

  validateJwksRegex() {
    const regex = /^https:\/\/.+$/;
    this.wrongJwks = this.jwks ? !regex.test(this.jwks) : false;
  }

  validatePresetNameRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongPresetName = this.presetName
      ? !regex.test(this.presetName) || this.presetName.length > 253
      : false;
  }

  save() {
    const data = {
      name: this.presetName,
      issuer: this.issuer,
      jwksUri: this.jwks
    };

    return this.idpPresetsService.createIdpPreset(data).subscribe(
      res => {
        const response: any = res;

        this.close();
        this.communicationService.sendEvent({
          type: 'createResource',
          data: response.createIDPPreset
        });
      },
      err => {
        this.error = `Error: ${err}`;
      }
    );
  }
}
