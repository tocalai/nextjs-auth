"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "User Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "isVerified",
        header: "Verified",
    },
    {
        accessorKey: "count",
        header: "Count",
    },
    {
        accessorKey: "lastLogon",
        header: "Last Logon Time",
    }
]