:title: Rails Validations
:date: 2013-04-05
:slug: rails-validations
:description: The way I like Rails models validations to be done

Validating data in Rails should be a simple, straightforward thing to do inside ActiveRecord models.
However, I've found that many projects turn this simple thing into a messy and hard to read piece of code.

This is how an unreadable way of definining Rails validations looks:
<pre class="sh_ruby">
  class Project < ActiveRecord::Base

    before_filter :validate_assignee_is_admin

    validate_presence_of :name, :started_on, :assignee
    validate_numericality_of :members_count, even: true

  end
</pre>

This is how it should have been done instead:
<pre class="sh_ruby">
  class Project < ActiveRecord::Base

    validates :name, presence: true
    validates :started_on, presence: true
    validates :members_count, numericality: { even: true }
    validate :assignee_is_admin

    validates :assignee, presence: true

    def assigne_is_admin
      if assignee && !assignee.admin?
        errors.add(:assignee, I18n.t('activerecord.errors.models.project.attributes.assignee.admin_role'))
      end
    end
  end
</pre>

Why? Because it's a lot more understandable.

Still, after a few years of struggling with Rails validations, I figured this Rails way of doing it is still not the best approach. I do not like the validations to be inside the models which goes tightly coupled with the whole "Fat Models" ideology I hate. So I moved to other simpler alternatives such as: [Scrivener](https://github.com/soveran/scrivener) or just my own custom-made validation system for the specific domain I'm dealing with. I will cover this way of validating data in a future post.

But if you want to roll it the Rails way, **please** stop using those `validated_presence_of` and start using `validates` instead. Here's the rest of the examples for the `validates` usage: [http://guides.rubyonrails.org/active_record_validations_callbacks.html](http://guides.rubyonrails.org/active_record_validations_callbacks.html).
