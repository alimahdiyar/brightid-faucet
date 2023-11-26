import axios from "axios"
import { axiosInstance } from "."
import { EnrollmentRaffleApi, EnrollmentSignature, Prize } from "@/types"

export async function getRafflesListAPI(token: string | undefined) {
  if (token) {
    const response = await axiosInstance.get<Prize[]>(
      "/api/prizetap/raffle-list/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data
  }
  const response = await axiosInstance.get<Prize[]>(
    "/api/prizetap/raffle-list/"
  )
  return response.data
}

export async function updateEnrolledFinished(
  token: string,
  raffleID: number | undefined,
  txHash: string
) {
  const response = await axiosInstance.post<any>(
    `api/prizetap/set-enrollment-tx/${raffleID}/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
  return response.data
}

export async function updateClaimPrizeFinished(
  token: string,
  raffleID: number | undefined,
  txHash: string
) {
  const response = await axiosInstance.post<any>(
    `api/prizetap/set-claiming-prize-tx/${raffleID}/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
  return response.data
}

export async function getEnrollmentApi(token: string, raffleID: number) {
  const response = await axiosInstance.post<EnrollmentRaffleApi>(
    `/api/prizetap/raffle-enrollment/${raffleID}/`,
    null,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
  return response.data
}

export async function getMuonApi(raffleEntryId: number) {
  const app = Number(process.env.IS_STAGE) ? "stage_unitap" : "unitap"

  const response = await axios.post<EnrollmentSignature>(
    `https://shield.unitap.app/v1/?app=${app}&method=raffle-entry&params[raffleEntryId]=${raffleEntryId}`,
    null
  )
  return response.data
}

export async function getRaffleConstraintsVerifications(
  rafflePk: number,
  token: string
) {
  const response = await axiosInstance.get(
    "/api/prizetap/get-raffle-constraints/" + rafflePk + "/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )

  return response.data
}

export async function getLineaRaffleEntries() {
  const response = await axiosInstance.get("/api/prizetap/get-linea-entries/")

  return response.data
}
