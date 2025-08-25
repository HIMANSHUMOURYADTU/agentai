"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [steps, setSteps] = useState<string[]>(["Sign Up", "Email Verification", "Profile Setup"])
  const [newStep, setNewStep] = useState("")
  const router = useRouter()

  const addStep = () => {
    if (newStep.trim() && !steps.includes(newStep.trim())) {
      setSteps([...steps, newStep.trim()])
      setNewStep("")
    }
  }

  const removeStep = (stepToRemove: string) => {
    setSteps(steps.filter((step) => step !== stepToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || steps.length === 0) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          funnel_steps: steps,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create project")
      }

      setOpen(false)
      setName("")
      setDescription("")
      setSteps(["Sign Up", "Email Verification", "Profile Setup"])
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
      alert(error instanceof Error ? error.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new onboarding funnel project to start analyzing user drop-offs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g., Mobile App Onboarding"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this onboarding funnel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Funnel Steps</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a step..."
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addStep())}
              />
              <Button type="button" onClick={addStep} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {steps.map((step, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {step}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeStep(step)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || steps.length === 0}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
