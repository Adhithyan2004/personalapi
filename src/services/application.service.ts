import { prisma } from "../lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export const createApplication = async (
  userId: string,
  companyName: string,
  role: string,
  appliedDate: Date
) => {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.create({
      data: {
        userId,
        companyName,
        role,
        appliedDate,
        currentStatus: ApplicationStatus.APPLIED, 
      },
    });

    await tx.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status: ApplicationStatus.APPLIED,
      },
    });

    return application;
  });
};

export const updateApplicationStatus = async (
  applicationId: string,
  newStatus: ApplicationStatus,
  note?: string
) => {
  return prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { id: applicationId },
      data: { currentStatus: newStatus },
    });

    const history = await tx.applicationStatusHistory.create({
      data: {
        applicationId,
        status: newStatus,
        note,
      },
    });

    return history;
  });
};

