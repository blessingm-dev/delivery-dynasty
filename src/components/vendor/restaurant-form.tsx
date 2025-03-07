
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Restaurant, RestaurantFormData } from "@/types/restaurant";
import { useRestaurantMutation } from "@/hooks/use-restaurant";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Restaurant name must be at least 2 characters" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  cuisine_type: z.string().min(2, { message: "Cuisine type is required" }),
  delivery_time: z.string().min(1, { message: "Delivery time is required" }),
  delivery_fee: z.string().min(1, { message: "Delivery fee is required" }),
  address: z.string().min(5, { message: "Address is required" }),
});

interface RestaurantFormProps {
  initialData: Restaurant | null;
  userId: string | undefined;
}

export function RestaurantForm({ initialData, userId }: RestaurantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRestaurant, updateRestaurant } = useRestaurantMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      image: initialData?.image || "",
      cuisine_type: initialData?.cuisine_type || "",
      delivery_time: initialData?.delivery_time || "",
      delivery_fee: initialData?.delivery_fee || "",
      address: initialData?.address || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast.error("You must be logged in to update your restaurant");
      return;
    }

    setIsSubmitting(true);
    try {
      const restaurantData: Restaurant = {
        name: values.name,
        image: values.image,
        cuisine_type: values.cuisine_type,
        delivery_time: values.delivery_time,
        delivery_fee: values.delivery_fee,
        address: values.address,
        user_id: userId,
        rating: initialData?.rating || 0, // Default to 0 for new restaurants
        featured: initialData?.featured || false,
      };

      if (initialData) {
        await updateRestaurant({
          ...restaurantData,
          id: initialData.id,
        });
        toast.success("Restaurant updated successfully");
      } else {
        await createRestaurant(restaurantData);
        toast.success("Restaurant created successfully");
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("Failed to save restaurant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your restaurant name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This name will be displayed to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Type*</FormLabel>
                  <FormControl>
                    <Input placeholder="Italian, Chinese, Indian, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    The primary cuisine type of your restaurant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Image URL*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/restaurant-image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to your restaurant's main image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="delivery_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Time*</FormLabel>
                    <FormControl>
                      <Input placeholder="15-25 min" {...field} />
                    </FormControl>
                    <FormDescription>
                      Estimated delivery time range.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Fee*</FormLabel>
                    <FormControl>
                      <Input placeholder="$2.99" {...field} />
                    </FormControl>
                    <FormDescription>
                      Standard delivery fee.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormDescription>
                    The physical address of your restaurant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Restaurant" : "Create Restaurant"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
