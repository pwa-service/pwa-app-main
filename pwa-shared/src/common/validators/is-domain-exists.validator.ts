import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pwa/prisma';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDomainExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) { }

    async validate(domainId: string) {
        if (!domainId) return false;
        try {
            const domain = await this.prisma.domain.findUnique({
                where: { id: domainId },
                select: { id: true }
            });

            return !!domain;
        } catch (e) {
            return false;
        }
    }

    defaultMessage() {
        return 'Domain with this ID does not exist';
    }
}

export function IsDomainExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDomainExistsConstraint,
        });
    };
}
