
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VendorProfile } from "@/types/vendor";
import { toast } from "sonner";

export function useVendorProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  const fetchVendorProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("vendor_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found - this is fine for new vendors
        return null;
      }
      throw error;
    }

    return data as VendorProfile;
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vendor-profile", userId],
    queryFn: () => (userId ? fetchVendorProfile(userId) : null),
    enabled: !!userId,
  });

  return {
    profile,
    isLoading,
    error,
  };
}

export function useVendorProfileMutation() {
  const queryClient = useQueryClient();

  const createProfile = async (profile: VendorProfile) => {
    const { data, error } = await supabase.from("vendor_profiles").insert(profile);

    if (error) {
      console.error("Error creating vendor profile:", error);
      throw error;
    }

    return data;
  };

  const updateProfile = async (profile: VendorProfile) => {
    const { data, error } = await supabase
      .from("vendor_profiles")
      .update(profile)
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating vendor profile:", error);
      throw error;
    }

    return data;
  };

  const createProfileMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
    },
  });

  return {
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
  };
}
